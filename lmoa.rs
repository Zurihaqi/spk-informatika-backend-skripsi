use std::cmp;
use std::collections::BinaryHeap;

/// Represents a graph structure.
struct Graph {
    num_vertices: usize,
    adjacency_list: Vec<Vec<(usize, i32)>>,
}

impl Graph {
    /// Creates a new instance of Graph with the given number of vertices.
    fn new(num_vertices: usize) -> Self {
        let adjacency_list = vec![Vec::new(); num_vertices];
        Self {
            num_vertices,
            adjacency_list,
        }
    }

    /// Adds an edge to the graph.
    fn add_edge(&mut self, from: usize, to: usize, weight: i32) {
        self.adjacency_list[from].push((to, weight));
    }

    /// Computes the total weight of vertices in a strongly connected component.
    fn compute_scc_total_weight(&self, scc: &[usize], weights: &[i32]) -> i32 {
        scc.iter().map(|&v| weights[v]).sum()
    }

    /// Retrieves the minimum weight subgraph.
    fn get_minimum_weight_subgraph(&self) -> Vec<Vec<(usize, i32)>> {
        let sccs = self.tarjan_scc();
        let mut min_weight = std::i32::MAX;
        let mut min_weight_scc_indices = Vec::new();

        for (index, scc) in sccs.iter().enumerate() {
            let total_weight = self.compute_scc_total_weight(scc, &self.get_weights());
            if total_weight < min_weight {
                min_weight = total_weight;
                min_weight_scc_indices.clear();
                min_weight_scc_indices.push(index);
            } else if total_weight == min_weight {
                min_weight_scc_indices.push(index);
            }
        }

        let weights = self.get_weights();
        min_weight_scc_indices
            .into_iter()
            .map(|index| sccs[index].iter().map(|&v| (v, weights[v])).collect())
            .collect()
    }

    /// Performs Tarjan's Strongly Connected Components algorithm.
    fn tarjan_scc(&self) -> Vec<Vec<usize>> {
        let mut index = 0;
        let mut stack = Vec::new();
        let mut lowlink = vec![0; self.num_vertices];
        let mut on_stack = vec![false; self.num_vertices];
        let mut ids = vec![None; self.num_vertices];
        let mut sccs = Vec::new();
        let mut weights = vec![0; self.num_vertices];

        for v in 0..self.num_vertices {
            if ids[v].is_none() {
                self.strongconnect(
                    v, &mut index, &mut stack, &mut lowlink, &mut on_stack, &mut ids, &mut sccs, &mut weights,
                );
            }
        }

        sccs
    }

    /// Helper function for Tarjan's algorithm.
    fn strongconnect(
        &self,
        v: usize,
        index: &mut usize,
        stack: &mut Vec<usize>,
        lowlink: &mut Vec<usize>,
        on_stack: &mut Vec<bool>,
        ids: &mut Vec<Option<usize>>,
        sccs: &mut Vec<Vec<usize>>,
        weights: &mut Vec<i32>,
    ) {
        lowlink[v] = *index;
        *index += 1;
        stack.push(v);
        on_stack[v] = true;
        let mut min_lowlink = lowlink[v];

        for &(w, _weight) in &self.adjacency_list[v] {
            if lowlink[w] == 0 {
                self.strongconnect(w, index, stack, lowlink, on_stack, ids, sccs, weights);
            }
                if on_stack[w] {
                min_lowlink = cmp::min(min_lowlink, lowlink[w]);
            }
        }

            if lowlink[v] == min_lowlink {
        let mut scc = Vec::new();
        let mut total_weight = 0;

        loop {
            let w = stack.pop().unwrap();
            on_stack[w] = false;
            ids[w] = Some(sccs.len());
            scc.push(w);
            total_weight += weights[w];

            if w == v {
                break;
            }
        }

        sccs.push(scc);
        weights[sccs.len() - 1] = total_weight;
    } else {
        lowlink[v] = min_lowlink;
    }
}

/// Computes the weights of the vertices.
fn get_weights(&self) -> Vec<i32> {
    let mut weights = vec![0; self.num_vertices];
    let mut indegrees = vec![0; self.num_vertices];

    for v in 0..self.num_vertices {
        for &(w, weight) in &self.adjacency_list[v] {
            indegrees[w] += 1;
            weights[w] += weight;
        }
    }

    let mut queue = BinaryHeap::new();

    for v in 0..self.num_vertices {
        if indegrees[v] == 0 {
            queue.push(v);
        }
    }

    while let Some(v) = queue.pop() {
        for &(w, weight) in &self.adjacency_list[v] {
            indegrees[w] -= 1;
            weights[w] = cmp::max(weights[w], weights[v] + weight);
            if indegrees[w] == 0 {
                queue.push(w);
            }
        }
    }
        weights
    }
}

fn main() {
    let mut graph = Graph::new(5);
    graph.add_edge(0, 1, 3);
    graph.add_edge(1, 2, 2);
    graph.add_edge(2, 4, 1);
    graph.add_edge(2, 3, 4);
    graph.add_edge(4, 0, 7);

    let min_weight_sccs = graph.get_minimum_weight_subgraph();
    println!("Minimum weight subgraph:");
    for scc in min_weight_sccs {
        println!("{:?}", scc);
    }
}
